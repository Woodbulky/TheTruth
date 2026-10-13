import 'server-only';
import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';

const blocked = new BlockList();
for (const [net, bits] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['224.0.0.0', 3],
] as const) blocked.addSubnet(net, bits, 'ipv4');
for (const [net, bits] of [['::', 127], ['fc00::', 7], ['fe80::', 10], ['ff00::', 8]] as const) blocked.addSubnet(net, bits, 'ipv6');

const isPrivate = (ip: string) => {
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)?.[1]; // IPv4-mapped IPv6
  return mapped ? blocked.check(mapped, 'ipv4') : blocked.check(ip, isIP(ip) === 6 ? 'ipv6' : 'ipv4');
};

async function assertPublic(url: URL) {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Only http(s) links');
  if (url.username || url.password) throw new Error('Credentials in URL');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  const ips = isIP(host) ? [host] : (await lookup(host, { all: true })).map((a) => a.address);
  if (!ips.length || ips.some(isPrivate)) throw new Error('Private address');
}

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * Fetch an untrusted URL: http/s only, every hop (max 3 redirects) must resolve to a public IP,
 * 8s total timeout, 2MB body cap. Returns the final URL and body bytes.
 * ponytail: resolve-then-fetch leaves a DNS-rebinding window; pin the IP with an undici Agent `lookup` if this ever fetches with credentials.
 */
export async function safeFetch(raw: string): Promise<{ url: string; bytes: Buffer; type: string }> {
  const signal = AbortSignal.timeout(8000);
  let url = new URL(raw);
  for (let hop = 0; hop <= 3; hop++) {
    await assertPublic(url);
    const res = await fetch(url, { redirect: 'manual', signal, headers: { 'user-agent': 'TheTruthBot/1.0 (+fact-check)', accept: 'text/html,text/plain,application/pdf;q=0.9,*/*;q=0.5' } });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location')!, url);
      continue;
    }
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const chunks: Uint8Array[] = [];
    let size = 0;
    const reader = res.body.getReader();
    for (let r = await reader.read(); !r.done; r = await reader.read()) {
      size += r.value.length;
      if (size > MAX_BYTES) { await reader.cancel(); break; } // keep what we have: the start of a page is what matters
      chunks.push(r.value);
    }
    return { url: url.href, bytes: Buffer.concat(chunks), type: res.headers.get('content-type') ?? '' };
  }
  throw new Error('Too many redirects');
}
