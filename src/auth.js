// /src/auth.js
import jwt from 'jsonwebtoken';

export const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1h' });
};

export const authenticateGraphQL = (context) => {
  let token = context.headers.authorization;
  if (!token) {
    throw new Error('Unauthorized - Missing token');
  }
  try {
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    if (!decoded.userId) {
      throw new Error('Unauthorized - Invalid token');
    }
  } catch (error) {
    throw new Error('Unauthorized - Invalid token');
  }
}

export const authenticate = (req, res, next) => {
  token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }
  token = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

export const login = (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized - Invalid credentials' });
  }

  const token = createToken(1);
  res.json({ token });
};