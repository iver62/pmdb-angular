export interface RoleRepresentation {
  id: string,
  name: string,
  description: string,
  scopeParamRequired: boolean,
  composite: boolean,
  composites: boolean,
  clientRole: boolean,
  containerId: string,
  attributes: string
}