import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateCustomerId } from '../utils/idGenerator.js';

export const createCustomer = async (req, res) => {
  const { fullName, email, password, company } = req.body;
  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('Customer already exists');
  }

  const lastUser = await User.findOne({ customerId: { $exists: true, $ne: null } }).sort({ createdAt: -1 });
  let count = 1;
  if (lastUser && lastUser.customerId) {
    const match = lastUser.customerId.match(/CUS(\d+)/);
    if (match) {
      count = parseInt(match[1], 10) + 1;
    }
  }
  const customerId = await generateCustomerId(count);
  const hashedPassword = await bcrypt.hash(password, 10);

  const customer = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'customer',
    customerId,
    company,
  });

  res.status(201).json({ customer });
};

export const getCustomers = async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('-password');
  res.status(200).json({ customers });
};

export const updateCustomer = async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer || customer.role !== 'customer') {
    res.status(404);
    throw new Error('Customer not found');
  }

  Object.assign(customer, req.body);
  if (req.body.password) {
    customer.password = await bcrypt.hash(req.body.password, 10);
  }

  await customer.save();
  res.status(200).json({ customer });
};

export const deleteCustomer = async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer || customer.role !== 'customer') {
    res.status(404);
    throw new Error('Customer not found');
  }

  await customer.remove();
  res.status(200).json({ message: 'Customer deleted' });
};

export const toggleCustomerBlock = async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer || customer.role !== 'customer') {
    res.status(404);
    throw new Error('Customer not found');
  }

  customer.isBlocked = !customer.isBlocked;
  await customer.save();
  res.status(200).json({ customer });
};
