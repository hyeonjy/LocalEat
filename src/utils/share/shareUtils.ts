declare global {
  interface Window {
    Kakao?: any;
  }
}

export const isKakaoReady = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.Kakao &&
  !!window.Kakao.isInitialized?.();

export const copyLinkToClipboard = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    /* fallback */ const i = document.createElement('input');
    i.value = url;
    document.body.appendChild(i);
    i.select();
    document.execCommand('copy');
    i.remove();
  }
};

export const shareViaKakao = ({
  title,
  description,
  imageUrl,
  url,
}: {
  title: string;
  description?: string;
  imageUrl: string;
  url: string;
}): boolean => {
  if (!isKakaoReady() || !window.Kakao?.Share) return false;
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description: description ?? '',
      imageUrl,
      link: { webUrl: url, mobileWebUrl: url },
    },
    buttons: [
      { title: '자세히 보기', link: { webUrl: url, mobileWebUrl: url } },
    ],
  });
  return true;
};
