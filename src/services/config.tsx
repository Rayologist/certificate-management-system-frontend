import urlJoin from "url-join";
const domain = process.env.NEXT_PUBLIC_INTERNAL_SERVER_DOMAIN;

if (!domain){
    throw new Error("INTERNAL_DOMAIN undefined")
}
const internals = "internals";

export const activityUrl = urlJoin(domain, internals, "activity");
export const participantUrl = urlJoin(domain, internals, "participant");
export const certificateUrl = urlJoin(domain, internals, "certificate");
export const sessionUrl = urlJoin(domain, internals, "session");
export const previewUrl = urlJoin(certificateUrl, "preview");
export const staticUrl = urlJoin(domain, internals, "f");
export const certUrl = urlJoin(domain, "cert");
