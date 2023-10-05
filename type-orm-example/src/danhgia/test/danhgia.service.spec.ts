import { INestApplication, Inject, forwardRef } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { DanhGia } from "../danhgia.entity";
import { JwtBacklistModule } from "../../authen/blacklist/jwt.backlist.module";
import { DanhGiaController } from "../danhgia.controller";
import { DanhGiaService } from "../danhgia.service";
import { DanhGiaRepository } from "../danhgia.repository";
import { SanPhamRepository } from "../../sanpham/sanpham.repository";
import { UserRepository } from "../../user/user.repository";
import { SanPham } from "../../sanpham/sanpham.entity";
import { User } from "../../user/user.entity";
import { DanhGiaRequestDTO } from "../danhgia.dto";
import { faker } from "@faker-js/faker";
import { DanhGiaModule } from "../danhgia.module";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { ModuleRef, NestContainer } from "@nestjs/core";
import { UserModule } from "../../user/user.module";
import { SanPhamModule } from "../../sanpham/sanpham.module";
import { typeormConfigAsync } from "../../database-connect/database-connect.config";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { ActiveService } from "../../authen/active/active.service";
import { SanPhamService } from "../../sanpham/sanpham.service";

describe('DanhGia API', () => {
  // done: jest.DoneCallBack khái báo trong call back của hàm test, it, beforeAll, afterAll, beforeEach, afterEach
  let app: INestApplication;
  let moduleFixture: TestingModule;
  const accessToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIwNzYsImVtYWlsIjoidWJ1bnR1LnRlc3RAZ21haWwuY29tIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE2OTU5MTk2NDIsImV4cCI6MTY5NjAwNjA0Mn0.eZbFJMCPJ91bnWPxNMYkJcYdeeviQnkT8kjQ7P0Uu-M';

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        // DanhGiaModule,
        // TypeOrmModule.forRootAsync(typeormConfigAsync),
        JwtBacklistModule,
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([SanPham]),
        TypeOrmModule.forFeature([DanhGia])
      ],
      providers: [
        DanhGiaService,
        SanPhamRepository,
        UserRepository,
        DanhGiaRepository
      ],
      controllers: [DanhGiaController]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  })

  describe('API get DanhGia by SanPham', () => {
    test('get success status code 200', async () => {
      const jsonResponseCorrect: string = `
      [
        {
          "tenUser": "ubuntu",
          "anhUser": "ubuntu.jpg",
          "noiDungBinhLuan": "test comment update :>",
          "ngayBinhLuan": "26/09/2023 23:28:36",
          "soSaoVote": 5
        },
        {
          "tenUser": "<script>alert(\\\\\\"Hello World\\\\\\")</script>",
          "anhUser": "./img_user/4e0aef79d65801b09a69c2898588b771f84cab89.jpg",
          "noiDungBinhLuan": "Nguyễn\\\\\\\\nNgọc\\\\\\\\nNam",
          "ngayBinhLuan": "13/06/2023 15:45:34",
          "soSaoVote": 5
        },
        {
          "tenUser": "hbgWwax",
          "anhUser": null,
          "noiDungBinhLuan": "Sản phẩm rất tuyệt vời, cảm ơn shop, lần sau sẽ mua ủng hộ tiếp",
          "ngayBinhLuan": "22/12/2022 05:50:35",
          "soSaoVote": 5
        },
        {
          "tenUser": "vQMfIKd",
          "anhUser": null,
          "noiDungBinhLuan": "Sản phẩm rất tuyệt vời, cảm ơn shop, lần sau sẽ mua ủng hộ tiếp",
          "ngayBinhLuan": "28/11/2021 14:22:19",
          "soSaoVote": 5
        },
        {
          "tenUser": "hHmIeUr",
          "anhUser": null,
          "noiDungBinhLuan": "Sản phẩm rất tuyệt vời, cảm ơn shop, lần sau sẽ mua ủng hộ tiếp",
          "ngayBinhLuan": "13/09/2021 19:51:31",
          "soSaoVote": 5
        }
      ]`;
      const response: request.Response = await request(app.getHttpServer())
        .get(`/api/danh-gia/by-san-pham?spid=73&page=1&iip=5`)
        .expect('Content-Type', 'application/json; charset=utf-8')

      // console.log(response.body);
      // console.log(jsonResponseCorrect);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(JSON.parse(jsonResponseCorrect));
      // return response;
      // console.log(response);
      // return response;
    });

    test('get faile if exceeded number of items per page', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .get('/api/danh-gia/by-san-pham?spid=73&page=1&iip=50')
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ statusCode: 400, message: 'Vượt quá số lượng item trong một page' });
    });

    test('get faile if product does not exist', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .get('/api/danh-gia/by-san-pham?spid=730&page=1&iip=5')
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ statusCode: 400, message: 'Sản phẩm không tồn tại' });
    });

    test('get faile if page exceeds the maximum number of pages', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .get('/api/danh-gia/by-san-pham?spid=73&page=100&iip=5')
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ statusCode: 400, message: 'page vượt quá số trang tối đa' });
    });
  });

  describe('API create DanhGia', () => {
    let idSanPham = 73;

    test('create new DanhGia success', async () => {
      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .post(`/api/danh-gia/${idSanPham}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        statusCode: 201,
        message: 'Tạo đánh giá thành công!'
      });
    });

    test('create new DanhGia faile if SanPham is not exsist', async () => {
      idSanPham = 730;

      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .post(`/api/danh-gia/${idSanPham}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Sản phẩm không tồn tại!'
      });
    });

    test('authentication error', async () => {
      const outPutExpect = {
        message: "Unauthorized",
        statusCode: 401
      }

      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .post(`/api/danh-gia/${idSanPham}`)
        .set('Authorization', `Bearer ${faker.string.sample({ min: 0, max: 150 })}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual(outPutExpect);
    });

    test('"Nội dung bình luận" from request is empty', async () => {
      const newDanhGia = {
        noiDungBinhLuan: '',
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      } as any as DanhGiaRequestDTO;

      const response: request.Response = await request(app.getHttpServer())
        .post(`/api/danh-gia/${idSanPham}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContainEqual('noiDungBinhLuan should not be empty');
    });

    test('"Số sao vote" from request is empty', async () => {
      const newDanhGia = {
        noiDungBinhLuan: faker.string.sample({ min: 5, max: 20 }),
      } as any as DanhGiaRequestDTO;

      const response: request.Response = await request(app.getHttpServer())
        .post(`/api/danh-gia/${idSanPham}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContainEqual('soSaoVote must be an integer number');
    });

    test('"Số sao vote" from request is not integer', async () => {
      const newDanhGia = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.string.sample({ min: 0, max: 20 })
      } as any as DanhGiaRequestDTO;

      const response: request.Response = await request(app.getHttpServer())
        .post(`/api/danh-gia/${idSanPham}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContainEqual('soSaoVote must be an integer number');
    });
  });

  describe.skip('API update DanhGia', () => {
    let idDanhGia = 3858;

    test.skip('update new DanhGia success', async () => {
      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        message: "Cập nhật đánh giá thành công!"
      });
    });

    test('update new DanhGia faile if DanhGia is not exsist', async () => {
      idDanhGia = 1000000;

      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: "Đánh giá không tồn tại!"
      });
    });

    test('update new DanhGia faile if User does not have update permissions', async () => {
      idDanhGia = 1234;

      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: "Bạn không có quyền sửa đánh giá này!"
      });
    });

    test('authentication error', async () => {
      const outPutExpect = {
        message: "Unauthorized",
        statusCode: 401
      }

      const newDanhGia: DanhGiaRequestDTO = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      };

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${faker.string.sample({ min: 0, max: 150 })}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual(outPutExpect);
    });

    test('"Nội dung bình luận" from request is empty', async () => {
      const newDanhGia = {
        noiDungBinhLuan: '',
        soSaoVote: faker.number.int({ min: 0, max: 5 })
      } as any as DanhGiaRequestDTO;

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContainEqual('noiDungBinhLuan should not be empty');
    });

    test('"Số sao vote" from request is empty', async () => {
      const newDanhGia = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
      } as any as DanhGiaRequestDTO;

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContainEqual('soSaoVote must be an integer number');
    });

    test('"Số sao vote" from request is not integer', async () => {
      const newDanhGia = {
        noiDungBinhLuan: faker.string.sample({ min: 1, max: 20 }),
        soSaoVote: faker.string.sample({ min: 5, max: 20 })
      } as any as DanhGiaRequestDTO;

      const response: request.Response = await request(app.getHttpServer())
        .put(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newDanhGia)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContainEqual('soSaoVote must be an integer number');
    });
  });

  describe.skip('API delete DanhGia', () => {
    let idDanhGia = 3858;

    test('delete new DanhGia success', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .delete(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        message: "Xóa đánh giá thành công!"
      });
    });

    test('delete new DanhGia faile if DanhGia is not exsist', async () => {
      idDanhGia = 1000000;

      const response: request.Response = await request(app.getHttpServer())
        .delete(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: "Đánh giá không tồn tại!"
      });
    });

    test('delete new DanhGia faile if User does not have delete permissions', async () => {
      idDanhGia = 1234;

      const response: request.Response = await request(app.getHttpServer())
        .delete(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: "Bạn không có quyền xóa đánh giá này!"
      });
    });

    test('authentication error', async () => {
      const outPutExpect = {
        message: "Unauthorized",
        statusCode: 401
      }

      const response: request.Response = await request(app.getHttpServer())
        .delete(`/api/danh-gia/${idDanhGia}`)
        .set('Authorization', `Bearer ${faker.string.sample({ min: 0, max: 150 })}`)
        .expect('Content-Type', 'application/json; charset=utf-8')

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual(outPutExpect);
    });
  });
});
