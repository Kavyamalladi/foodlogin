import type { Instrumentation } from "next";

/** Safety net: any uncaught error in a page, route handler or server action lands in the log with its real message. */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const { log, errInfo } = await import("@/lib/log");
  log.error("unhandled_request_error", {
    ...errInfo(err),
    digest: (err as { digest?: string }).digest,
    path: request.path,
    method: request.method,
    routeType: context.routeType,
    routePath: context.routePath,
  });
};
