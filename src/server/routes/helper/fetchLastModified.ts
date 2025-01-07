/**
 * fetchLastModified connection page.
 *
 * @copyright 2020-present Inrae
 * @review 31-01-2024
 * @author mario.adam@inrae.fr
 *
 */

export async function fetchLastModified(url: string) {
  console.log("-------------------------------------fetchLastModified---------------------");
  console.log(url);
  
  const response = await fetch(url, { method: "HEAD" });
  console.log(response);
  
  const temp = response.headers.get('date');
  if (temp) return new Date(temp);
}