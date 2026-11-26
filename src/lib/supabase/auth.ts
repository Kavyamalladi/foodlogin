type ClaimsRecord = Record<string, unknown>;

type ClaimsAuthClient = {
  auth: {
    getClaims: () => Promise<{
      data: {
        claims?: ClaimsRecord | null;
      } | null;
    }>;
  };
};

export async function getClaimsSafely(
  supabase: ClaimsAuthClient
): Promise<ClaimsRecord | null> {
  try {
    const { data } = await supabase.auth.getClaims();
    return data?.claims ?? null;
  } catch (error) {
    console.error("[supabase-auth] Failed to read auth claims", error);
    return null;
  }
}
