describe('Dummy Test Suite', () => {
  it('Dummy Test', () => {
    const val = true;
    expect(val).toBeTruthy();
  });
});

// docker build -t digonto/web:0.0.12 --progress=plain --no-cache --target=test ../digonto.in/web
