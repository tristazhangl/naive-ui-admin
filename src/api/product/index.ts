import { Alova } from '@/utils/http/alova/index';
import { ContentTypeEnum } from '@/enums/httpEnum';
import qs from 'qs'
import { useRequest } from 'alova/client';

//获取table
export function getProductList(params) {
  return Alova.Post('/supermarket/store/list', 
  qs.stringify(params),
  {
    headers: {
      "content-type": ContentTypeEnum.FORM_URLENCODED,
    },
  }
  );
}

// 批量上传图片
export function uploadEIPicture(eiId, fileList) {
  const formdata = new FormData();
  fileList.forEach(ele => {
    formdata.append('files', ele as File);
  });
  for (const [key, value] of formdata) {
    console.log(key, value);
  }

  return Alova.Post(`/supermarket/photo/save/${eiId}`, 
    formdata,
    {
      headers: {
        "content-type": ContentTypeEnum.FORM_DATA,
      },
      cacheFor: null,
    }
  )
}

// 查询设材图片
export function getProductPictures(eiId) {
  return Alova.Get(`/supermarket/photo/list/${eiId}`, 
  );
}

// 查询设材图片
export async function getPictureData(photoId) {
  const res = await Alova.Get(`/supermarket/photo/getPhotoImage/${photoId}`, 
    {
      responseType: "blob",
    }
  );
  const data = res;
  const url = window.URL.createObjectURL(new Blob([data]));
  return {
    photoId: photoId,
    url,
  };
}

// 设材图片自定义类型
export interface EiPicItem {
  photoId: string;
  url:string; 
}

// 删除设材图片
export function rmProductPic(photoId) {
  return Alova.Post(`/supermarket/photo/delete/${photoId}`, 
    undefined,
  );
}

// 更新设材图片位置
export function modifyProductPic(photoId, position) {
  const params = {
    dataOrder: position,
  }
  return Alova.Post(`/supermarket/photo/modifys/${photoId}`, 
    qs.stringify(params),
    {
      headers: {
        "content-type": ContentTypeEnum.FORM_URLENCODED,
      },
    }
  );
}

