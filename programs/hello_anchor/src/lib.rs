use anchor_lang::prelude::*;

declare_id!("7DGqdSk1KSEQs1r3v5gR3Mx4Cfuf9PMnvRwTpEcfzQzS");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize_no_pda(ctx: Context<InitializeNoPda>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeNoPda<'info> {
    #[account(
        init, 
        payer = signer, 
        space = 8 + 8
    )]
    pub new_account: Account<'info, NewAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64
}
