export function modelValidator(body: any, fields: { name: string, type: string }[]): { errorMessage: string } | null {
    let messages = '';

    fields.forEach(field => {
        if (body[field.name] === undefined) {
            messages += `${field.name} field missing. `;
        }
        if (typeof (body[field.name]) !== field.type) {
            messages += `field ${field.name} must be a ${field.type}. `;
        }
    });

    const nonZeroValues = fields.reduce((total, arg) => body[arg.name] + total, 0) > 0;
    if (!nonZeroValues) {
        messages += 'at least one field should have value greater than 0';
    }

    if (messages !== '') {
        return { errorMessage: messages };
    }
    return null;
}