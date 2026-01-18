import ogs from 'open-graph-scraper';

export const fallbackWorkImage =
  'https://private-user-images.githubusercontent.com/12427733/291065628-5ba5419b-d0d1-4450-9a40-0e8b33133138.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Njg0ODM3NjQsIm5iZiI6MTc2ODQ4MzQ2NCwicGF0aCI6Ii8xMjQyNzczMy8yOTEwNjU2MjgtNWJhNTQxOWItZDBkMS00NDUwLTlhNDAtMGU4YjMzMTMzMTM4LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAxMTUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMTE1VDEzMjQyNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWMwZWYzZDhhNGFiODg0NjAwYTA5NzViODBkNDlhZGYwNzY4ZjA1M2I5NTdmODYxZjYyMDI5MmJjYjEzNmFiZjEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.OCiR_0Qka_XKuEKTm1UJ2s12GyNn4n2PBm518VKIPnU';

export interface OgpData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
}

export async function fetchOgp(url: string): Promise<OgpData | null> {
  try {
    const { result, error } = await ogs({ url });

    if (error || !result) {
      console.warn(`Failed to fetch OGP for ${url}:`, error);
      return null;
    }

    return {
      title: result.ogTitle,
      description: result.ogDescription,
      image: Array.isArray(result.ogImage) ? result.ogImage[0]?.url : result.ogImage?.url,
      siteName: result.ogSiteName,
      type: result.ogType,
    };
  } catch (error) {
    console.error(`Error fetching OGP for ${url}:`, error);
    return null;
  }
}
