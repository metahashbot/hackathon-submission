export default async function publish({toBePublished}: {toBePublished: string}) {
    const res = await fetch("https://publisher.walrus-testnet.walrus.space/v1/store?epochs=100", {
        method: "PUT",
        body: toBePublished
    });

    return res.json();
}