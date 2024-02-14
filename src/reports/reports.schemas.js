const reportResponseSchema = {
  id: { type: "number" },
  category: { type: "string" },
  customerId: { type: "string" },
  description: { type: "string" },
  labels: { type: "array" },
  owner: { type: ["string", "null"] },
  assignedTo: { type: ["string", "null"] },
  createdAt: { type: "string" },
  editedAt: { type: "string" },
  closedAt: { type: ["string", "null"] },
  state: { type: "string" },
  priority: { type: ["number", "null"] },
  comments: {
    type: "array",
    items: {
      type: "object",
      properties: {
        author: { type: "string" },
        message: { type: "string" },
        type: {
          type: "string",
          enum: ["Customer", "Developer", "Product_Manager"],
        },
      },
    },
  },
  closeReason: { type: ["string", "null"] },
  references: { type: "array" },
};

const createReportBodySchema = {
  type: "object",
  required: ["category", "customerId", "description"],
  properties: {
    category: { type: "string", enum: ["Feedback", "Bug", "Question"] },
    customerId: { type: "string" },
    description: { type: "string" },
    labels: { type: "array" },
  },
};

const createReportResponseSchema = {
  201: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const addLabelBodySchema = {
  type: "object",
  required: ["label"],
  properties: {
    label: { type: "string" },
  },
};

const addLabelResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const addCommentBodySchema = {
  type: "object",
  required: ["author", "message", "type"],
  properties: {
    author: { type: "string" },
    message: { type: "string" },
    type: {
      type: "string",
      enum: ["Customer", "Developer", "Product_Manager"],
    },
  },
};

const addCommentResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const updateStateBodySchema = {
  type: "object",
  required: ["state"],
  properties: {
    state: { type: "string", enum: ["OPEN", "IN_PROGRESS", "CLOSED"] },
    reason: {
      type: "string",
    },
  },
};

const updateStateResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const updateOwnerBodySchema = {
  type: "object",
  required: ["owner"],
  properties: {
    owner: { type: "string" },
  },
};

const updateOwnerResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const updateAssigneeBodySchema = {
  type: "object",
  required: ["assignedTo"],
  properties: {
    assignee: { type: "string" },
  },
};

const updateAssigneeResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const updatePriorityBodySchema = {
  type: "object",
  required: ["priority"],
  properties: {
    priority: { type: "number" },
  },
};

const updatePriortyResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const getReportQueryStringSchema = {
  type: "object",
  properties: {
    state: { type: "string", enum: ["OPEN", "IN_PROGRESS", "CLOSED"] },
    category: { type: "string", enum: ["Feedback", "Bug", "Question"] },
    priority: { type: "number" },
    customerId: { type: "string" },
    owner: { type: "string" },
    assignedTo: { type: "string" },
    labels: { type: "array" },
  },
};

const updateDescriptionBodySchema = {
  type: "object",
  required: ["description"],
  properties: {
    description: { type: "string" },
  },
};

const updateDescriptionResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

const closeReportBodySchema = {
  type: "object",
  required: ["reason"],
  properties: {
    reason: { type: "string" },
  },
};

const closeReportResponseSchema = {
  200: {
    type: "object",
    properties: reportResponseSchema,
  },
};

export const createReportSchema = {
  schema: {
    body: createReportBodySchema,
    response: createReportResponseSchema,
  },
};

export const addLabelSchema = {
  schema: {
    body: addLabelBodySchema,
    response: addLabelResponseSchema,
  },
};

export const deleteLabelSchema = {
  schema: {
    body: addLabelBodySchema,
    response: addLabelResponseSchema,
  },
};

export const addCommentSchema = {
  schema: {
    body: addCommentBodySchema,
    response: addCommentResponseSchema,
  },
};

export const updateStateSchema = {
  schema: {
    body: updateStateBodySchema,
    response: updateStateResponseSchema,
  },
};

export const updateOwnerSchema = {
  schema: {
    body: updateOwnerBodySchema,
    response: updateOwnerResponseSchema,
  },
};

export const updateAssignedToSchema = {
  schema: {
    body: updateAssigneeBodySchema,
    response: updateAssigneeResponseSchema,
  },
};

export const updatePrioritySchema = {
  schema: {
    body: updatePriorityBodySchema,
    response: updatePriortyResponseSchema,
  },
};

export const getAllReportsSchema = {
  schema: {
    querystring: getReportQueryStringSchema,
  },
};

export const updateDescriptionSchema = {
  schema: {
    body: updateDescriptionBodySchema,
    response: updateDescriptionResponseSchema,
  },
};

export const closeReportSchema = {
  schema: {
    body: closeReportBodySchema,
    response: closeReportResponseSchema,
  },
};
