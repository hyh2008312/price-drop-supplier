import {Component, EventEmitter, Input, OnInit, Output,OnChanges} from '@angular/core';
import { ImageUploadPreviewService } from "../../../shared/components/image-upload-preview/image-upload-preview.service";
import { S3UploaderService } from "../../../shared/services/s3-upload/s3-upload.service";

import { HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-product-image-upload-additional',
  templateUrl: './image-upload-additional.component.html',
  styleUrls: ['./_image-upload-additional.component.scss']
})
export class ImageUploadAdditionalComponent implements OnInit {

  @Input() previewImgFile: any[] = [];
  @Output() previewImgFileChange: EventEmitter<any[]> = new EventEmitter();

  @Input() previewImgSrcs: any[] = [];

  loading: any = [0,0,0,0,0];

  upload: any = false;

  closeLoading: any = [true,true,true,true,true];

  closeAnimate: any = [false,false,false,false,false];

  constructor(
    public previewImageService: ImageUploadPreviewService,
    public s3UploaderService: S3UploaderService
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    if(this.previewImgSrcs.length >= 5) {
      this.upload = true;
    }
  }

  previewPic(event) {
    if(!event.target.files[0]) {
      return;
    }
    let that = this;
    let length = that.previewImgSrcs.length;
    that.loading[length] = 0;
    that.closeLoading[length] = false;
    that.closeAnimate[length] = false;

    this.previewImageService.readAsDataUrl(event.target.files[0]).then(function(result) {

      that.previewImgSrcs.push(result);
      let file = event.target.files[0];

      let image = new Image();
      image.onload = function(){
        let width = image.width;
        let height = image.height;

        that.s3UploaderService.upload({
          type: 'product/main',
          fileName: file.name,
          use: 'cover',
          width: width,
          height: height
        }).then((data) => {
          let src = data.url + '/' + data.name;
          let url = data.url;
          let key = data.name;

          that.s3UploaderService.uploadToS3(file, data).subscribe((event) => {
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            if (event.type === HttpEventType.UploadProgress) {
              // This is an upload progress event. Compute and show the % done:
              that.loading[length] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              that.closeAnimate[length] = true;
              that.closeLoading[length] = true;
              src = url + '/' + key;
              that.previewImgFile.push(src);
              that.previewImgFileChange.emit(that.previewImgFile);
            }
          });
        });
      };
      image.src = window.URL.createObjectURL(file);

      if( that.previewImgSrcs.length >= 5) {
        that.upload = true;
      }
    });

  }

  remove(i) {
    this.previewImgSrcs.splice(i,1);
    this.previewImgFile.splice(i,1);

    this.upload = false;
  }

  loadingChange(event, index) {
    if(event) {
    }
  }


}
