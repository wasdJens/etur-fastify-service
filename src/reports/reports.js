import { logger } from "../server.js";

let id = 0;
export const reports = [];

/**
 *
 * @param {number} id - The id of the report to look for
 * @returns
 */
export function getReport(id) {
  return reports.find((report) => report.id === id);
}

/**
 * 
 * @param {string} id - The id of the report to update
 * @param {Object} report - The original report
 * @returns 
 */
export function updateReport(id, report) {
  const index = reports.findIndex((report) => report.id === id);
  if (index === -1) {
    return false;
  }
  reports.splice(index, 1, report);
  return true;
}

/**
 * @param {Object} filterOptions - The filter options
 * @param {string} filterOptions.state - Either 'OPEN', 'IN_PROGRESS', 'CLOSED
 * @param {string} filterOptions.category - Either 'Feedback', 'Bug', 'Question'
 * @param {number} filterOptions.priority - Either 1,2,3 or 4
 * @param {string} filterOptions.customerId - The id of the customer
 * @param {string} filterOptions.owner  - The name of the owner
 * @param {string} filterOptions.assignedTo - The name of the person the report is assigned to
 * @param {string} filterOptions.labels - The labels to filter by
 * @returns
 */
export function filterReports(filterOptions) {
  const filterFunction = (report) =>
    (!filterOptions.state || report.state === filterOptions.state) &&
    (!filterOptions.category || report.category === filterOptions.category) &&
    (!filterOptions.priority || report.priority === filterOptions.priority) &&
    (!filterOptions.customerId ||
      report.customerId === filterOptions.customerId) &&
    (!filterOptions.owner || report.owner === filterOptions.owner) &&
    (!filterOptions.assignedTo ||
      report.assignedTo === filterOptions.assignedTo) &&
    (!filterOptions.labels || report.labels.includes(filterOptions.labels));

  return reports.filter((report) => filterFunction(report));
}


/**
 *
 * @param {Object} fields
 * @param {string} fields.category - Either 'Feedback', 'Bug', 'Question'
 * @param {string} fields.customerId - The id of the customer that created the report
 * @param {string} fields.description - The description of the report
 * @param {string[]} fields.labels - The labels of the report
 */
export function createNewReportBoilerplate(fields) {
  id++;

  if (
    fields.category !== "Feedback" &&
    fields.category !== "Bug" &&
    fields.category !== "Question"
  ) {
    logger.warn(
      `Invalid category got: ${fields.category}, defaulting to Feedback`
    );
    fields.category = "Feedback";
  }

  const newReport = {
    id: id,
    category: fields.category,
    customerId: fields.customerId,
    description: fields.description,
    labels: fields.labels ?? [],
    owner: null,
    assignedTo: null,
    createdAt: new Date().toISOString(),
    editedAt: new Date().toISOString(),
    closedAt: null,
    state: "OPEN",
    priority: null,
    comments: [],
    closeReason: null,
    references: [],
  };

  logger.info(`Created new report: ${JSON.stringify(newReport)}`);

  return newReport;
}

/**
 * @param {Object} report - The report to modify
 * @param {string} owner - The name of the owner
 * @returns An updated report object
 */
export function setOwner(report, owner) {
  const editedAt = new Date().toISOString();
  const updatedReport = {
    ...report,
    owner: owner ?? "Unknown",
    editedAt: editedAt,
  };
  logger.info(
    `Updated report ${JSON.stringify(updatedReport)} with owner ${owner}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report - The report to modify
 * @param {string} assignedTo - The name of the person the report is assigned to
 * @returns An updated report object
 */
export function setAssignedTo(report, assignedTo) {
  const editedAt = new Date().toISOString();
  const updatedReport = {
    ...report,
    assignedTo: assignedTo ?? "Unknown",
    editedAt: editedAt,
  };
  logger.info(
    `Updated report ${JSON.stringify(
      updatedReport
    )} with assignedTo ${assignedTo}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report - The report to modify
 * @param {number} priority - Either 1,2,3 or 4
 * @returns An updated report object
 */
export function setPriority(report, priority) {
  const editedAt = new Date().toISOString();
  if (priority < 1 || priority > 4) {
    logger.warn(`Invalid priority got ${priority}, defaulting to 1`);
    priority = 1;
  }
  const updatedReport = { ...report, priority: priority, editedAt: editedAt };
  logger.info(
    `Updated report ${JSON.stringify(updatedReport)} with priority ${priority}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report - The report to modify
 * @param {string} state - Either 'OPEN', 'IN_PROGRESS', 'CLOSED'
 * @param {string} reason - The reason for the state change
 * @returns An updated report object.
 */
export function setState(report, state, reason) {
  const editedAt = new Date().toISOString();
  if (state !== "OPEN" && state !== "IN_PROGRESS" && state !== "CLOSED") {
    logger.warn(`Invalid state got ${state}, defaulting to IN_PROGRESS`);
    state = "IN_PROGRESS";
  }
  const updatedReport = { ...report, state: state, editedAt: editedAt };
  if (state === "CLOSED") {
    const closedAt = editedAt;
    updatedReport.closedAt = closedAt;
    updatedReport.closeReason = reason ?? "Automated by ETUR Service";
  }
  logger.info(
    `Updated report ${JSON.stringify(
      updatedReport
    )} with state ${state} and reason ${reason}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report - The report to modify
 * @param {Object} comment - The new comment to add
 * @param {string} comment.author - The author of the comment
 * @param {string} comment.message - The message of the comment
 * @param {string} comment.type - The type of the comment. Either 'Customer', 'Developer', or 'Product_Manager'
 * @returns
 */
export function addComment(report, comment) {
  const editedAt = new Date().toISOString();

  if (
    comment.type !== "Customer" &&
    comment.type !== "Developer" &&
    comment.type !== "Product_Manager"
  ) {
    logger.warn(
      `Invalid comment type got ${comment.type}, defaulting to Developer`
    );
    comment.type = "Developer";
  }

  const newComment = {
    author: comment.author ?? "Unknown",
    message: comment.message ?? "",
    createdAt: editedAt,
    type: comment.type,
  };

  const updatedReport = {
    ...report,
    comments: [...report.comments, newComment],
    editedAt: editedAt,
  };
  logger.info(
    `Added comment ${JSON.stringify(newComment)} to report ${JSON.stringify(
      updatedReport
    )}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report - The report to close
 * @param {string} reason - The reason for closing the report
 * @returns
 */
export function closeReport(report, reason) {
  const closedReport = setState(report, "CLOSED", reason);
  logger.info(`Closed report ${JSON.stringify(closedReport)}`);
  return closedReport;
}

/**
 *
 * @param {Object} report - The report on which the label should be added to
 * @param {string} label - The actual label to add
 */
export function addLabel(report, label) {
  const editedAt = new Date().toISOString();
  const updatedReport = {
    ...report,
    labels: [...report.labels, label],
    editedAt: editedAt,
  };
  logger.info(
    `Added label ${label} to report ${JSON.stringify(updatedReport)}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report - The report on which the label should be removed
 * @param {string} label - the label to be removed
 * @returns
 */
export function removeLabel(report, label) {
  const editedAt = new Date().toISOString();
  const updatedReport = {
    ...report,
    labels: report.labels.filter((l) => l !== label),
    editedAt: editedAt,
  };
  logger.info(
    `Removed label ${label} from report ${JSON.stringify(updatedReport)}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report  - The report to modify
 * @param {string} description - The new description
 * @returns
 */
export function setDescription(report, description) {
  const editedAt = new Date().toISOString();
  const updatedReport = {
    ...report,
    description: description,
    editedAt: editedAt,
  };
  logger.info(
    `Updated report ${JSON.stringify(
      updatedReport
    )} with description ${description}`
  );
  return updatedReport;
}

/**
 *
 * @param {Object} report -
 * @param {string} category - Either 'Feedback', 'Bug', 'Question'
 * @returns
 */
export function setCategory(report, category) {
  if (
    category !== "Feedback" &&
    category !== "Bug" &&
    category !== "Question"
  ) {
    logger.warn(`Invalid category got ${category}, defaulting to Feedback`);
    category = "Feedback";
  }

  const editedAt = new Date().toISOString();
  const updatedReport = {
    ...report,
    category: category,
    editedAt: editedAt,
  };
  logger.info(
    `Updated report ${JSON.stringify(updatedReport)} with category ${category}`
  );
  return updatedReport;
}
