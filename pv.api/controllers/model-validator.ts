export function modelValidator(
    params: any,
    fields: { name: string, type: string, valuesAccepted?: any[] }[],
    checkNonZero = true
): { errorMessage: string[] } | null {
    let messages: string[] | null = [];

    fields.forEach(field => {
        if (params[field.name] === undefined) {
            messages?.push(`${field.name} field missing.`);
        }
        if (typeof (params[field.name]) !== field.type) {
            messages?.push(`field ${field.name} must be a ${field.type}.`);
        }
        if (field.valuesAccepted && !field.valuesAccepted.includes(params[field.name])) {
            messages?.push(`field ${field.name} must be of values [${field.valuesAccepted.join(',')}]`);
        }
    });

    if (checkNonZero) {
        const nonZeroValues = fields.reduce((total, arg) => params[arg.name] + total, 0) > 0;
        if (!nonZeroValues) {
            messages?.push('at least one field should have value greater than 0');
        }
    }

    if (messages.length) {
        return { errorMessage: messages };
    }

    return null;
}