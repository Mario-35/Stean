/**
 * connectWeb Enum
 *
 * @copyright 2025-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export async function connectWeb() {
    return new Promise(async (resolve, reject) => {
        try {
            await fetch(`https://www.google.com`, {
                method: "GET",
                referrerPolicy: "no-referrer"
            })
                .then((data) => {
                    resolve(data["status"] == 200);
                })
                .catch((error) => {
                    reject(!error);
                });
        } catch (error) {
            reject(!error);
        }
    });
}
