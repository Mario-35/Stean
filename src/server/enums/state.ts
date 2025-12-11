/**
 * EState Enum
 *
 * @copyright 2020-present Inrae
 * @review 29-10-2024
 * @author mario.adam@inrae.fr
 *
 */

export enum EState {
    start = "start",
    createDb = "createDb",
    restart = "restart",
    normal = "normal",
    clean = "clean",
    import = "import",
    maintenance = "maintenance",
}
