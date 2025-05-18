import { type Handle } from "@sveltejs/kit";
import * as awilix from "awilix";
import { registerEnvironment, registerInjections } from "$lib/server/container";
import { Logger, LoggerService } from "$lib/server";
import { env as privateEnv } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    strict: true,
});
registerEnvironment(container, {...privateEnv, ...publicEnv});
registerInjections(container);

LoggerService.configure("info");
const logger = Logger.create("request");

// eslint-disable-next-line @typescript-eslint/unbound-method
export const handle: Handle = async function ({ event, resolve }) {
    const startTime = Date.now();

    // setup
    event.locals.container = container.createScope();

    // response
    const response = await resolve(event);

    // cleanup
    if (response.status >= 500 && response.status <= 599) {
        logger.error("%s %s - %s - %sms", event.request.method, event.url.pathname, response.status, Date.now() - startTime);
    } else {
        logger.info("%s %s - %s - %sms", event.request.method, event.url.pathname, response.status, Date.now() - startTime);
    }

    return response;
};

export function handleError({ error, message }) {
    if (message != "Not Found") {
        console.error(error);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const debug_message = (publicEnv.PUBLIC_DEBUG && error?.cause?.message || error?.message) || message;
    return { message: debug_message };
}