import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
