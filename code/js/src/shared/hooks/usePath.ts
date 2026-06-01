import { useBootstrap } from "./useBootstrap"

export const usePath = () => {
    const { assets } = useBootstrap();

    const buildMediaUrl = (path: string) => `${assets.publicMediaBaseUrl}/${path}`

    return {
        buildMediaUrl
    }
}
