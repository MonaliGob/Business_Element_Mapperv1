# Business Element Manager

A comprehensive system for tracking, validating, and visualizing complex database mappings and business element relationships. This application helps organizations manage and maintain their business elements, data quality rules, and database mappings in a centralized location.

## Features

- 📊 Interactive Sankey chart for mapping visualization
- 📝 Comprehensive business element tracking
- ✅ Data quality rule implementation and management
- 🔄 Multi-database support
- 🏢 Detailed category and owner group integration
- 📈 Version history tracking

## Prerequisites

Before you begin, ensure your Linux server has the following:

- Node.js 20.x or later
- PostgreSQL 15.x or later
- Git
- A system user with sudo privileges

## Installation Guide

### 1. System Preparation

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Install required system dependencies
sudo apt install -y curl build-essential postgresql postgresql-contrib
```

### 2. Install Node.js 20.x

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### 3. PostgreSQL Setup

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE business_element_db;"
sudo -u postgres psql -c "CREATE USER bemanager WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE business_element_db TO bemanager;"
```

### 4. Application Installation

```bash
# Clone the repository
git clone https://github.com/MonaliGob/Business_Element_Mapperv1.git
cd Business_Element_Mapperv1

# Install dependencies
npm install
```

### 5. Environment Setup

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL="postgresql://bemanager:your_secure_password@localhost:5432/business_element_db"

# Optional: Configure port (default: 5000)
PORT=5000
```

### 6. Database Initialization

```bash
# Push the database schema
npm run db:push

# (Optional) Seed the database with sample data
curl http://localhost:5000/api/seed
```

### 7. Running the Application

#### Development Mode

```bash
# Start in development mode
npm run dev
```

#### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm start
```

The application will be available at `http://your_server_ip:5000`

## Directory Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and helpers
├── server/              # Backend Express server
├── db/                  # Database schema and migrations
└── public/             # Static assets
```

## Key Features Guide

### Business Elements Management
- Create and manage business elements
- Assign categories and owner groups
- Track element definitions and versions

### Data Quality Rules
- Define validation rules for elements
- Support for multiple rule types:
  - Format validation
  - Range checks
  - Enumeration validation
  - Regular expressions
  - Custom rules
- Rule severity levels and status tracking

### Database Mappings
- Map elements to database columns
- Support for multiple database connections
- Track transformation logic

### Categories and Owner Groups
- Organize elements by categories
- Manage element ownership and responsibilities

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Check database connection:
```bash
psql -d business_element_db -U bemanager -h localhost
```

3. Verify environment variables:
```bash
echo $DATABASE_URL
```

### Application Startup Issues

1. Check Node.js installation:
```bash
node --version
npm --version
```

2. Verify required ports are available:
```bash
sudo lsof -i :5000
```

3. Check application logs:
```bash
npm run dev
```

### Common Solutions

1. If the database schema is out of sync:
```bash
npm run db:push
```

2. If dependencies are missing or corrupted:
```bash
rm -rf node_modules
npm install
```

3. If port 5000 is in use:
- Modify the PORT in `.env` file
- Or stop the process using the port:
```bash
sudo kill $(sudo lsof -t -i:5000)
```

## Support

If you encounter any issues or need assistance:

1. Check the [issues section](https://github.com/MonaliGob/Business_Element_Mapperv1/issues) on GitHub
2. Submit a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node.js version, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.