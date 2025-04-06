export class FileSystemService {
  public saveFile<T>(data: T): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "option-list";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public loadFile<T>(): Promise<T> {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    return new Promise((resolve, reject) => {
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) {
          reject(new Error("No file"));
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event): Promise<void> => {
          try {
            const data = JSON.parse(event.target?.result as string);
            resolve(data);
          } catch (error) {
            reject(new Error("Error JSON: " + error));
          }
        };

        reader.readAsText(file);
      });

      input.click();
    });
  }
}

export const fileSystemService = new FileSystemService();
