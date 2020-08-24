export interface SendgridMailModel {
    to: string[]
    from: {email: string, name: string},
    templateId: string,
    dynamic_template_data: any
}
