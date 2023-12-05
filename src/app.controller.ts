import {Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {
  Between,
  Equal,
  ILike, In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository
} from "typeorm";
import {UserModel} from "./entity/user.entity";
import {ProfileModel} from "./entity/profile.entity";
import {PostModel} from "./entity/post.entity";
import {TagModel} from "./entity/tag.entity";

@Controller()
export class AppController {
  constructor(
      @InjectRepository(UserModel)
      private readonly userRepository: Repository<UserModel>,

      @InjectRepository(ProfileModel)
      private readonly profileRepository: Repository<ProfileModel>,

      @InjectRepository(PostModel)
      private readonly postRepository: Repository<PostModel>,

      @InjectRepository(TagModel)
      private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안 합니다! create
    // const user1 = this.userRepository.create({
    //   email: 'test@gmail.com',
    // });

    // 객체 생성하고 저장 하는 save
    // const user2 = this.userRepository.save({
    //   email: 'test2@gmail.com',
    // })

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함
    // 저장하지는 않음

    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'test3@gmail.com',
    // });

    // 삭제하기
    // await this.userRepository.delete(
    //     101,
    //     );
    // return true;

    // id가 1인 항목의 count를 2만큼 증가시킨다. increment
    // id가 1인 항목의 count를 2만큼 감소시킨다. decrement

    // await this.userRepository.increment({
    //   id: 1,
    // }, 'count', 2);

    // 갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // })

    // sum
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });

    // average
    // const average = await this.userRepository.average('count', {
    //   email: ILike('%0%'),
    // });

    // 최소값
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });

    // 최대값
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // })

    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    })

    // list and 필터링 하지 않았으면 될 값 return 해준다
    return usersAndCount;
  }


  @Get('users')
  getUsers() {
    return this.userRepository.find({
      order: {
        id: 'asc',
      },
      where: {
        // 아닌 경우 가져오기
        // id: Not(1),
        // 적은 경우 가져오기
        // id: LessThan(30),
        // 적은경우 or 많은 경우
        // id : LessThanOrEqual(30)
        // 많은 경우
        // id : MoreThan(30),
        // 많거나 같은 경우
        // id : MoreThanOrEqual(30),
        // 같은 경우
        // id: Equal(30),
        // 유사값
        // email: Like('%google%'),
        // 근데 대문자는 필터링 불가해서 ILike 사용
        // email: ILike('%google%'),
        // 사이값
        // id: Between(10, 15),
        // 해당되는 여러개의 값
        // id: In([1, 3, 5, 7, 9]),


      },
    })
  }

  // async getUsers() {
  //   const users = await this.userRepository.find({
  //     relations: {
  //       profile: true,
  //       posts: true,
  //     },
  //   });
  //   return users;
  // }

  // 어떤 프로퍼티를 선택할지
  // 기본은 모든 프로퍼티를 가져온다
  // 만약에 select를 정의하지 않으면
  // select를 정의하면 정의된 프로퍼티만 가져오게 된다.
  // select: {}


  // where : 필터링할 조건을 입력하게 된다.
  // where : {version : 1,}

  // 관계를 가져오는 법
  // relations: {}

  // 오름차 내림차
  // ASC DESC
  // order: { id: 'DESC', }

  // skip : 처음 몇 개를 제외할지
  // skip : 2
  // take : 몇 개를 가져올지
  // take : 2
  @Post('users')
  // postUser() {
  //   return this.userRepository.save({});
  // }

  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      })
    }
  }

  @Patch('users/:id')
  async patchUser(
      @Param('id') id: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      }
    })

    return this.userRepository.save({
      ...user,
    })
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string,){
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'grie2manna717@gmail.com',
    })

    const profile = await this.profileRepository.save({
      profileImg: 'asdf.jpg',
      user
    })

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email : 'postuser@gmail.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    })

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    })

    return user;
  }


  @Post('posts/tags')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'Nest JS',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts:[post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'TypeScript',
      posts:[post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS',
      tags:[tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      }
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      }
    })
  }
}
