import os
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0" if os.getenv("RENDER") or os.getenv("ENVIRONMENT") == "production" else "127.0.0.1")
    reload = False if os.getenv("RENDER") or os.getenv("ENVIRONMENT") == "production" else True
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
