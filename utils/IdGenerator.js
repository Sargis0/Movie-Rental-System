export class IdGenerator {
    static generateNextId(existingItems, prefix, padLength = 3) {
        console.log(existingItems, prefix)
        if (!existingItems || existingItems.length === 0) {
            return `${prefix}${'1'.padStart(padLength, '0')}`;
        }

        const lastItem = existingItems[existingItems.length - 1];
        const lastIdNumber = parseInt(lastItem.id.replace(prefix, '')) || 0;
        const nextIdNumber = lastIdNumber + 1;

        return `${prefix}${nextIdNumber.toString().padStart(padLength, '0')}`;
    }
}
