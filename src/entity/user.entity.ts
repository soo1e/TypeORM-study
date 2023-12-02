import {
    Column,
    CreateDateColumn,
    Entity,
    Generated, OneToMany, OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import {ProfileModel} from "./profile.entity";
import {PostModel} from "./post.entity";

export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class UserModel {


    // @PrimaryGeneratedColumn()
    // 자동 생성하는 primary 값
    //
    // @PrimaryColumn()
    // 직접 입력해야하는 primary

    @PrimaryGeneratedColumn()
        // PrimaryGeneratedColumn -> 순서대로 올라간다
        //
        // // UUID
        // // asdf1234-asdfq34t-asdfwherth-asfdf34r
        // // 알고리즘을 통해 겹치지 않는 랜덤 값 생성
    id: number;

    @Column()
    email: string;
    // @Column({
    //     // 데이터베이스에서 인지하는 칼럼 타입
    //     // 자동으로 유추됨
    //     type: "text",
    //     // 데이터베이스 칼럼 이름
    //     // 프로퍼티 이름으로 자동 유추됨
    //     name: 'title',
    //     // 값의 길이
    //     // 입력 할 수 있는 글자의 길이
    //     // length: 300,
    //     // null이 가능한지
    //     nullable: true,
    //     // true면 처음 저장할 때만 값 지정 가능
    //     // 이후에는 값 변경 불가능,
    //     update: true,
    //
    //     // find()를 실행할 때 기본으로 값을 불러올지
    //     // 기본값이 true
    //     select : true,
    //
    //     // 입력하지 않았을 때 기본 값
    //     default : 'default value',
    //
    //     // 칼럼 중에서 유일무이한 값이 되어야 하는지
    //     // ex. email
    //     unique : false,
    // })
    // title: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    // 데이터 생성 일자
    // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다
    @CreateDateColumn()
    createdAt: Date;

    // 데이터 업데이트
    // 데이터가 업데이트되는 날짜와 시간이 자동으로 찍힌다.
    @UpdateDateColumn()
    updatedAt: Date;


    // 데이터가 업데이트 될때마다 1씩 올라간다
    // 처음 생성되는 값은 1이다
    // save() 함수가 몇 번 불렸는지 기억한다
    @VersionColumn()
    version: number;

    @Column()
    @Generated('uuid')
    additionalId: string;

    @OneToOne(()=> ProfileModel, (profile)=> profile.user)
    profile: ProfileModel;

    @OneToMany(()=> PostModel, (post)=> post.author)
    posts: PostModel[];
}