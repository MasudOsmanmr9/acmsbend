
var storage = require("@azure/storage-blob")
const { BlobServiceClient, BlobClient } = require("@azure/storage-blob");
const blobServiceClient = BlobServiceClient.fromConnectionString("");


class AzureStorageUtils {

    async uploadBase64(data, fileName, folder, container) {
        try {
            if (folder) folder = folder + "/";
            else folder = "";

            fileName.replace('_','_');

            var fileNameExt = folder + fileName;
            var res = await this.createStorageContainer(container);

            const containerClient = blobServiceClient.getContainerClient(container);
            const blockBlobClient = containerClient.getBlockBlobClient(fileNameExt);
            const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length > 0) {
                console.log("uploadBase64 with header");
                const base64Str = matches.length > 2 ? matches[2] : matches[1];
                const buffer = new Buffer.from(base64Str, 'base64');
                if (fileName.indexOf(".") === -1) {
                    var imageTypeDetected = matches[1].match(
                        /\/(.*?)$/
                    );
                    if(folder =="ProfileImage"){
                        fileNameExt += '.png';
                    }else{
                        fileNameExt += '.' +
                        imageTypeDetected[1];
                    }
                    
                }
                const result = await blockBlobClient.upload(buffer, buffer.byteLength);
                if (result.requestId) {
                    let cdnLink = process.env.CDN_URL;
                    return { Success: true, Message: { fileName: fileName, link: cdnLink + container + "/" + fileNameExt } };
                }
                else {
                    return { Success: false, Message: JSON.stringify(result) };
                }

            }
            else {
                console.log("uploadBase64 headerless");
                const buffer = new Buffer.from(data, 'base64');
                const result = await blockBlobClient.upload(buffer, buffer.byteLength);
                if (result.requestId) {
                    let cdnLink = process.env.CDN_URL;
                    return { Success: true, Message: { fileName: fileName, link: cdnLink + container + "/" + fileNameExt } };
                }
                else {
                    return { Success: false, Message: JSON.stringify(result) };
                }
            }
        } catch (error) {
            console.log("uploadBase64 error: " + JSON.stringify(error));
            return { Success: false, Message: JSON.stringify(error) };
        }
    }

    async uploadBuffer(buffer, fileName, folder, container) {
        try {
            if (folder) folder = folder + "/";
            else folder = "";
            fileName = folder + fileName;
            var res = await this.createStorageContainer(container);

            const containerClient = blobServiceClient.getContainerClient(container);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            if (!res.Success) {
                return { Success: false, Message: res.Message };
            } else
                await blockBlobClient.upload(buffer, buffer.byteLength);

            let cdnLink = process.env.CDN_URL;
            return { Success: true, Message: JSON.stringify(cdnLink + container + "/" + fileName) };
        } catch (error) {
            return { Success: false, Message: JSON.stringify(error) };
        }
    }

    async uploadStream(streamfile, fileName, folder, container) {
        try {
            if (folder) folder = folder + "/";
            else folder = "";
            fileName = folder + fileName;
            var res = await this.createStorageContainer(container);

            const containerClient = blobServiceClient.getContainerClient(container);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            if (!res.Success) {
                return { Success: false, Message: res.Message };
            } else {
                await blockBlobClient.uploadStream(streamfile);
            }

            let cdnLink = process.env.CDN_URL;
            return { Success: true, Message: cdnLink + container + "/" + fileName };
        } catch (error) {
            return { Success: false, Message: error.toString() };
        }
    }

    async createStorageContainer(containerName) {
        try {
            var response = await blobServiceClient.createContainer(containerName, { access: "blob" })
            if (response.containerCreateResponse.requestId) {
                return { Success: true, Message: response.containerClient.url };
            }
        } catch (err) {
            if (err.statusCode == 409) {
                return { Success: true, Message: process.env.CDN_URL + containerName };
            } else
                return { Success: false, Message: JSON.stringify(err) };
        }
    }

    async checkExistBlob(bloburl) {
        try {
            if (bloburl) {
                const blobClient = new BlobClient(bloburl);
                var res = await blobClient.exists();
                if (!res) {
                    return { Success: true, IsExist: false };
                } else return { Success: true, IsExist: true };
            } else {
                return { Success: true, IsExist: false };
            }
        } catch (error) {
            return { Success: false, Message: error.toString() };
        }
    }

    async deleteBlob(container, fileName) {
        try {
            const containerClient = blobServiceClient.getContainerClient(container);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            const res = await blockBlobClient.delete();
            if (res) console.log("File Deleted Successfully");
            else console.log("Unable to Delete");
        } catch (error) {
            // return { Success: false, Message: error.toString() };
            console.log(error.toString());
        }
    }

    async generateSASToken(containerName, permissions, duration) {
        try {
            if (!permissions)
                permissions = "r";

            if (!duration)
                duration = 1000 * 60 * 30;

            const cerds = new storage.StorageSharedKeyCredential(blobServiceClient.accountName, "");
            //const blobServiceClient = new storage.BlobServiceClient(`https://${accountname}.blob.core.windows.net`,cerds);

            const client = blobServiceClient.getContainerClient(containerName)
            // const blobName = "help.txt";
            // const blobClient = client.getBlobClient(blobName);

            const blobSAS = storage.generateBlobSASQueryParameters({
                containerName,
                permissions: storage.BlobSASPermissions.parse(permissions),
                startsOn: new Date(),
                expiresOn: new Date(new Date().valueOf() + duration)
            },
                cerds
            ).toString();

            console.log(blobSAS);
            return {
                token: blobSAS,
                uri: client.url.replace(containerName, ''),
                cdn: process.env.CDN_URL
            };
        }
        catch (ex) {
            console.log(ex.toString());
            return { Success: false, Message: ex.toString() };
        }
    }

}
module.exports = AzureStorageUtils