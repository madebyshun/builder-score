import { IdentityData } from './types'

// Warpcast public API — no key needed
export async function fetchFarcasterData(handle: string): Promise<{
  followers: number | null
  bio: string
  found: boolean
}> {
  try {
    const res = await fetch(
      `https://api.warpcast.com/v2/user-by-username?username=${handle.toLowerCase()}`,
      { signal: AbortSignal.timeout(5000) }
    )
    const data = await res.json()
    const user = data?.result?.user
    if (!user) return { followers: null, bio: '', found: false }
    return {
      followers: user.followerCount ?? null,
      bio: user.profile?.bio?.text || '',
      found: true,
    }
  } catch {
    return { followers: null, bio: '', found: false }
  }
}

// ENS / Basename via ensdata.net — no key needed
export async function checkENSBasename(handle: string): Promise<{
  hasENS: boolean
  hasBasename: boolean
}> {
  try {
    const [basenameRes, ensRes] = await Promise.allSettled([
      fetch(`https://ensdata.net/${handle.toLowerCase()}.base.eth`, { signal: AbortSignal.timeout(4000) }),
      fetch(`https://ensdata.net/${handle.toLowerCase()}.eth`, { signal: AbortSignal.timeout(4000) }),
    ])
    const basenameData = basenameRes.status === 'fulfilled' ? await basenameRes.value.json().catch(() => null) : null
    const ensData = ensRes.status === 'fulfilled' ? await ensRes.value.json().catch(() => null) : null
    return {
      hasBasename: !!basenameData?.address,
      hasENS: !!ensData?.address,
    }
  } catch {
    return { hasENS: false, hasBasename: false }
  }
}

export async function fetchAllIdentity(handle: string): Promise<IdentityData> {
  const [fc, ens] = await Promise.allSettled([
    fetchFarcasterData(handle),
    checkENSBasename(handle),
  ])
  const f = fc.status === 'fulfilled' ? fc.value : { followers: null, bio: '', found: false }
  const e = ens.status === 'fulfilled' ? ens.value : { hasENS: false, hasBasename: false }
  return {
    hasFarcaster: f.found,
    farcasterFollowers: f.followers ?? undefined,
    farcasterBio: f.bio,
    hasBasename: e.hasBasename,
    hasENS: e.hasENS,
  }
}
