use anchor_lang::prelude::*;

declare_id!("2rBAmrqbAxBJSfHBw1shwJfjuJxqQne7c14jdSjVLTAo");

#[program]
pub mod hello_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
