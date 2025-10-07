// src/utils/authApi.js — 軽量な実装（TypeScript 注釈を削除）
const CHECK_URL = import.meta.env.VITE_CHECK_URL;

// opts: { signal?: AbortSignal }
export async function checkAuth(opts) {
  const local = localStorage.getItem("authed") === "1";

  // URL が無いときは外部通信しない（これで本番でも落ちない）
  if (!CHECK_URL) return { authenticated: local };

  // fetch を使い、タイムアウトは内部で 5000ms に設定する
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const signal = opts?.signal ?? controller.signal;

  try {
    const res = await fetch(CHECK_URL, { signal });
    clearTimeout(timeoutId);

    if (!res.ok) return { authenticated: local };
    const data = await res.json();
    return { authenticated: (data && data.authenticated) ?? local };
  } catch (e) {
    // fetch の中断やネットワークエラーはローカルの値を返す
    return { authenticated: local };
  } finally {
    clearTimeout(timeoutId); // ← finally で必ず解放
  }
}
