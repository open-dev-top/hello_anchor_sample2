import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("hello_anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.helloAnchor as Program<HelloAnchor>;

  // 可重用的初始化函数，避免代码冗余
  const initializeAccount = async (account: Keypair, data: BN) => {
    const tx = await program.methods.initializeNoPda(data)
      .accounts({
        newAccount: account.publicKey,
        signer: anchor.getProvider().publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([account])
      .rpc();
    console.log("Transaction signature:", tx);
    return tx;
  };

  it("Should initialize account with data 42", async () => {
    const newAccount = Keypair.generate();
    const data = new BN(42);

    // 初始化账户
    await initializeAccount(newAccount, data);

    // 读取账户数据并验证
    const accountData = await program.account.newAccount.fetch(newAccount.publicKey);
    console.log("Account data:", accountData.data.toString());
    
    // 断言验证数据是否正确写入
    expect(accountData.data.toString()).to.equal(data.toString());
  });

  it("Should call the same account twice", async () => {
    // 创建同一个账户
    const sameAccount = Keypair.generate();
    const firstData = new BN(42);
    const secondData = new BN(100);

    // 第一次调用
    console.log("First call with data:", firstData.toString());
    await initializeAccount(sameAccount, firstData);

    // 验证第一次写入的数据
    let accountData = await program.account.newAccount.fetch(sameAccount.publicKey);
    expect(accountData.data.toString()).to.equal(firstData.toString());

    // 第二次调用（使用同一个账户但不同的数据）
    console.log("Second call with data:", secondData.toString());
    await initializeAccount(sameAccount, secondData);

    // 验证第二次写入的数据（应该覆盖第一次的数据）
    accountData = await program.account.newAccount.fetch(sameAccount.publicKey);
    expect(accountData.data.toString()).to.equal(secondData.toString());
  });
});
