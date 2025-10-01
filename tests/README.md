# Test Suite

Minimal smoke tests to verify production readiness.

## Running Tests

### Backend Tests
```bash
python tests/test_backend.py
```

### Frontend Tests
```bash
python tests/test_frontend.py
```

### All Tests (with pytest if installed)
```bash
pip install pytest
pytest tests/
```

## Test Coverage

Current tests are **smoke tests** - they verify basic functionality:
- ✅ Backend imports work
- ✅ FastAPI app is configured
- ✅ Health endpoint exists
- ✅ Frontend is built
- ✅ Static assets exist

**TODO**: Add comprehensive tests for:
- API endpoint responses
- Frontend component rendering
- Integration tests
- Performance tests
