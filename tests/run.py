import pytest
import sys

if __name__ == "__main__":
    # Run tests with coverage report
    sys.exit(pytest.main([
        "--cov=server",
        "--cov-report=term-missing",
        "-v"
    ]))