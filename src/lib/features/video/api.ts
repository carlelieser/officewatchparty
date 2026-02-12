type VideoUrlResponse = {
	url: string;
};

export async function fetchVideoUrl(season: number, episode: number): Promise<string> {
	const response = await fetch(`/api/video-url?season=${season}&episode=${episode}`);
	const data: VideoUrlResponse = await response.json();
	return data.url;
}
