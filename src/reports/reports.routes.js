import {
  addComment,
  addLabel,
  createNewReportBoilerplate,
  removeLabel,
  setOwner,
  setState,
  setAssignedTo,
  setPriority,
  setDescription,
  closeReport,
  reports,
  getReport,
  updateReport,
  filterReports,
} from "./reports.js";
import {
  createReportSchema,
  addLabelSchema,
  deleteLabelSchema,
  addCommentSchema,
  updateStateSchema,
  updateOwnerSchema,
  getAllReportsSchema,
  updateAssignedToSchema,
  updatePrioritySchema,
  updateDescriptionSchema,
  closeReportSchema,
} from "./reports.schemas.js";

function getReportOrNotFound(id, reply) {
  const idAsInt = parseInt(id, 10);
  const report = getReport(idAsInt);
  if (!report) {
    reply.status(404).send({
      message: `Report with id ${id} not found`,
    });
  }
  return { report, idAsInt };
}

function updateReportOrFail(id, modifiedReport, reply) {
  const success = updateReport(id, modifiedReport);
  if (!success) {
    reply.status(500).send({
      message: `Failed to update report with id ${id}`,
    });
  }
  return modifiedReport;
}

/**
 *
 * @param {import("fastify").FastifyInstance} fastify  - Ecapsulated Fastify Instance
 * @param {*} options
 */
export async function reportsRoutes(fastify, options) {
  fastify.get("/", getAllReportsSchema, async (request, reply) => {
    const { state, category, priority, customerId, owner, assignedTo, labels } =
      request.query;
    const filteredReports = filterReports({
      state,
      category,
      priority,
      customerId,
      owner,
      assignedTo,
      labels,
    });
    return filteredReports;
  });

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    const { report } = getReportOrNotFound(id, reply);
    return report;
  });

  fastify.post("/", createReportSchema, async (request, reply) => {
    const report = createNewReportBoilerplate(request.body);
    reports.push(report);
    reply.status(201).send(report);
  });

  fastify.post("/:id/labels", addLabelSchema, async (request, reply) => {
    const { id } = request.params;
    const { label } = request.body;

    const { report, idAsInt } = getReportOrNotFound(id, reply);
    const modifiedReport = addLabel(report, label);
    return updateReportOrFail(idAsInt, modifiedReport, reply);
  });

  fastify.delete("/:id/labels", deleteLabelSchema, async (request, reply) => {
    const { id } = request.params;
    const { label } = request.body;

    const { report, idAsInt } = getReportOrNotFound(id, reply);
    const modifiedReport = removeLabel(report, label);
    return updateReportOrFail(idAsInt, modifiedReport, reply);
  });

  fastify.post("/:id/comments", addCommentSchema, async (request, reply) => {
    const { id } = request.params;
    const { author, message, type } = request.body;

    const { report, idAsInt } = getReportOrNotFound(id, reply);

    const modifiedReport = addComment(report, { author, message, type });
    return updateReportOrFail(idAsInt, modifiedReport, reply);
  });

  fastify.patch("/:id/state", updateStateSchema, async (request, reply) => {
    const { id } = request.params;
    const { state, reason } = request.body;

    const { report, idAsInt } = getReportOrNotFound(id, reply);

    const modifiedReport = setState(report, state, reason);
    return updateReportOrFail(idAsInt, modifiedReport, reply);
  });

  fastify.patch("/:id/owner", updateOwnerSchema, async (request, reply) => {
    const { id } = request.params;
    const { owner } = request.body;

    const { report, idAsInt } = getReportOrNotFound(id, reply);

    const modifiedReport = setOwner(report, owner);
    return updateReportOrFail(idAsInt, modifiedReport, reply);
  });

  fastify.patch(
    "/:id/assignement",
    updateAssignedToSchema,
    async (request, reply) => {
      const { id } = request.params;
      const { assignedTo } = request.body;

      const { report, idAsInt } = getReportOrNotFound(id, reply);

      const modifiedReport = setAssignedTo(report, assignedTo);
      return updateReportOrFail(idAsInt, modifiedReport, reply);
    }
  );

  fastify.patch(
    "/:id/priority",
    updatePrioritySchema,
    async (request, reply) => {
      const { id } = request.params;
      const { priority } = request.body;

      if (priority < 1 || priority > 4) {
        reply.status(400).send({
          message: `Priority must be between 1 and 4`,
        });
      }

      const { report, idAsInt } = getReportOrNotFound(id, reply);
      const modifiedReport = setPriority(report, priority);
      return updateReportOrFail(idAsInt, modifiedReport, reply);
    }
  );

  fastify.patch(
    "/:id/description",
    updateDescriptionSchema,
    async (request, reply) => {
      const { id } = request.params;
      const { description } = request.body;

      const { report, idAsInt } = getReportOrNotFound(id, reply);

      const modifiedReport = setDescription(report, description);
      return updateReportOrFail(idAsInt, modifiedReport, reply);
    }
  );

  fastify.post("/:id/close", closeReportSchema, async (request, reply) => {
    const { id } = request.params;
    const { reason } = request.body;

    const { report, idAsInt } = getReportOrNotFound(id, reply);

    const modifiedReport = closeReport(report, reason);

    return updateReportOrFail(idAsInt, modifiedReport, reply);
  });
}
