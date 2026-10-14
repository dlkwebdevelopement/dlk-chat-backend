import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateEmployeeId } from '../utils/idGenerator.js';

export const createEmployee = async (req, res) => {
  const { fullName, email, password, company, department } = req.body;
  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('Employee already exists');
  }

  const lastUser = await User.findOne({ employeeId: { $exists: true, $ne: null } }).sort({ createdAt: -1 });
  let count = 1;
  if (lastUser && lastUser.employeeId) {
    const match = lastUser.employeeId.match(/EMP(\d+)/);
    if (match) {
      count = parseInt(match[1], 10) + 1;
    }
  }
  const employeeId = await generateEmployeeId(count);
  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'employee',
    employeeId,
    company,
    department,
  });

  res.status(201).json({ employee });
};

export const getEmployees = async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('-password');
  res.status(200).json({ employees });
};

export const updateEmployee = async (req, res) => {
  const employee = await User.findById(req.params.id);
  if (!employee || employee.role !== 'employee') {
    res.status(404);
    throw new Error('Employee not found');
  }

  Object.assign(employee, req.body);
  if (req.body.password) {
    employee.password = await bcrypt.hash(req.body.password, 10);
  }

  await employee.save();
  res.status(200).json({ employee });
};

export const deleteEmployee = async (req, res) => {
  const employee = await User.findById(req.params.id);
  if (!employee || employee.role !== 'employee') {
    res.status(404);
    throw new Error('Employee not found');
  }

  await employee.remove();
  res.status(200).json({ message: 'Employee deleted' });
};

export const toggleEmployeeBlock = async (req, res) => {
  const employee = await User.findById(req.params.id);
  if (!employee || employee.role !== 'employee') {
    res.status(404);
    throw new Error('Employee not found');
  }

  employee.isBlocked = !employee.isBlocked;
  await employee.save();
  res.status(200).json({ employee });
};
