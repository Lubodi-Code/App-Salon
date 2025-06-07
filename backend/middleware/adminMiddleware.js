const adminMiddleware = async (req, res, next) => {
    try {
        const { user } = req;
        
        if (!user || !user.admin) {
            return res.status(403).json({ msg: 'No tienes permisos de administrador' });
        }
        
        next();
    } catch (error) {
        return res.status(403).json({ msg: 'Error de autenticación de administrador' });
    }
}

export default adminMiddleware;