export class TaskLabel {

  static fileUpload(fileName : string) : string {
    if(fileName.length > 10)
      return `File Upload - ${fileName.substring(0, 10)}..`;

    return `File Upload - ${fileName}`
  }

}
