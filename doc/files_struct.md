# Files Structure

`./Sw/` top level folder contains es-modules relative to Service Worker. Dynamic import (`import()`) is disabled for
Service Worker context (so we cannot use TeqFW DI) and SW files are cached by browsers itself (we should not include
these files into frontend installation package).
