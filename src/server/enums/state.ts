/**
 * EState Enum
 *
 * @copyright 2020-present Inrae
 * @review 29-10-2024
 * @author mario.adam@inrae.fr
 *
 */

export enum EState {
    maintenance = "maintenance",
    optimized = "optimized",
    createDb = "createDb",
    restart = "restart",
    import = "import",
    normal = "normal",
    clean = "clean",
    start = "start",
}
