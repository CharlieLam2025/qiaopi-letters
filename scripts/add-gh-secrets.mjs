// 给 GitHub repo 加 Actions secrets。
// secrets 必须用 repo 的 public key 加密后 PUT。
import sodium from "libsodium-wrappers";

const PAT = process.env.GH_PAT;
const OWNER = process.env.GH_OWNER;
const REPO = process.env.GH_REPO;
const SECRETS = JSON.parse(process.env.GH_SECRETS); // { NAME: value }

if (!PAT || !OWNER || !REPO || !SECRETS) {
  console.error("missing env: GH_PAT / GH_OWNER / GH_REPO / GH_SECRETS");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${PAT}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "qiaopi-deploy",
};

// 1. 拿 public key
const keyResp = await fetch(
  `https://api.github.com/repos/${OWNER}/${REPO}/actions/secrets/public-key`,
  { headers }
);
if (!keyResp.ok) {
  console.error("get key failed:", keyResp.status, await keyResp.text());
  process.exit(1);
}
const pk = await keyResp.json(); // { key_id, key (base64) }

await sodium.ready;
const keyBytes = sodium.from_base64(pk.key, sodium.base64_variants.ORIGINAL);

for (const [name, value] of Object.entries(SECRETS)) {
  const msgBytes = sodium.from_string(value);
  const sealed = sodium.crypto_box_seal(msgBytes, keyBytes);
  const encrypted_value = sodium.to_base64(sealed, sodium.base64_variants.ORIGINAL);

  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/secrets/${name}`,
    {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted_value, key_id: pk.key_id }),
    }
  );
  if (r.ok) {
    console.log(`  ✓ ${name}  (${r.status})`);
  } else {
    console.error(`  ✗ ${name}: ${r.status}  ${await r.text()}`);
  }
}
