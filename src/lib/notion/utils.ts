export const getNotionAuthUrl = async (redirectUrl: string, userId: string) => {
  const response = await fetch(
    `/api/auth/notion?redirectUrl=${encodeURIComponent(redirectUrl)}&userId=${userId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to get Notion auth URL");
  }
  const data = await response.json();
  return data.authUrl;
};
