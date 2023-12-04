import {Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
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

  @Get('users')
  async getUsers() {
    const users = await this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      },
    });
    return users;
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({});
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
