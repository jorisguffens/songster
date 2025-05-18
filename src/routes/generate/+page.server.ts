import { GenerateLoadController } from "./_controllers/generate.load.controller";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals: { container }, url }) => {
    return container.build(GenerateLoadController).load(url);
};