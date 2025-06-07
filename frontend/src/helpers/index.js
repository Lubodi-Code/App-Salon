export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(value)

}

