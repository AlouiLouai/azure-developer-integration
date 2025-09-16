import React from 'react';

const Home = () => {
  const user = {
    name: 'Current User',
    profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnz0Q0btHNjZOD0WrbiULsaqNHDQzra9OkOFW8GeJmbwgvoDCtaaY7Nxf14Iq2w9PYcxwt3m8pa9zyzBhhGy-ib2VrabXJe5RQDm8NmKbEpdQwfczmztoCw32Owr8BDaBZmxXCy2C6rX1OMHnDt_PPb6P-JXIbg1_Tp3b6lwMoR_B07KsS34-YO-d0m6khm8rR9yovF2jPohp9TX7cnRjuoqji2f1XI11DzO-Pnvj-eE5Ve0CPSabdFm_f8Xjo_np04lZTwZzlhJM',
  };

  const channels = [
    { name: '# general', id: '1' },
    { name: '# design-team', id: '2' },
    { name: '# project-phoenix', id: '3' },
  ];

  const members = [
    { name: 'Sarah Miller', profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQctJCoCtQIsDr-_2Ji4ShhbGSytjsF9t0OjYROALLRa3NXqQXq_AXLjHI7w2vi61cGLqmIczHb0DmLTZk8Ng5YUA6qiqQgF-Fr23PeY5xKBJKkVcs1zWozK8EzusI4VNgI5i6lUZT0R6S1CY3ytg_YPQNCe4grv72WCGlLWRWtTWPw3CCdFt80mxP4en3L06ycpeXMitkua5tI7FbzNdy3Nm-i_annHMyUqG_arxBOKTv4hyoMjAx-8fShIqzRpiwgUWiu9xqOA', status: 'online' },
    { name: 'Alex Johnson', profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDugoPmXjAOMpWG_uBEyZoI80nOzrCmcyY9onpWlM7olaomAU5Oxc5F1z66kHWk4qxMVwxyEJa26YZOCcyfR7RqbhmsXdauItlfOvzB5iP033ITYv9RlpY-4-4h46kCU3DDW0QsbAtwGBqiwiK5j-kygH3SwHsTxbY81JQTP1qPqjZgGqva6ouCNCjt0dcmdAUBptql9h3TE1OkUqSajOs30mVdSKpHpv6h3mzKzVnGTloFPDOAF7wogkqUGjTMAiW6jsfHBgBAhRY', status: 'online' },
    { name: 'Emily Rodriguez', profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW2WDyVVLhC9PebtHp-nPXt-0mgaQTiFLULKZ-Vs5ta2j0OVfeFMOdC54zgfnCWsxdAlX86L1igHw7EkW_USskr3w0qRdj9DeNQwUfidH4m1sx_lKOrE4K1W67SuiFjulU_CEHH2Knoo619mUMhrGGY_MyESm2ThV5fKclSpP_oVJr9EolIXG06FZ1vrn2goM2bpxz9kDGN95wl-l5bY9PsiDxkBGLHNZKMlWnjFys0SS-R7wUxOR72qIZUztkcNWzyCoLhBWWjng', status: 'offline' },
    { name: 'David Chen', profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOdq8GdmFvDk_2gtVRYcybVViYvHwPVQlJkKBZ4zvTMy1xKDkIPcYboC1biiHi0lz5cdP_9YmSZ-UjgN1e1RdCOt31vbX862PeVO2jtjpYaBWdLbUGg4h8xII1pHMGhY7Xe1NybSHZ6-UmOOKGjVtJmwb0nJbfu0rIN9OSO4BLRzaOHBq3Yfv6nXu4VdFI9edbL4DZCt7m1Owb4u5xDy_-dDFWFbwPduG6mKBZ7VV8_UEOFywdOrt7DVvCBvcFWRMMzGfSXFtD32k', status: 'offline' },
    { name: 'Jessica Nguyen', profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNHIGJekVWFsF_BVvDaJnz-qHtCkltZtWRepkjQ68TYh3Uy1l-4ZDHlUDQblLq193dbvXfP5JgrqIUC-2GPnAu4PFsLERdTICZeb15TZVgL7gl3czs3DxoZz8PcEs_JUKwEoRy-yxYvW71A3EWCsbSmVmbTZwWCOh7ArhB1ilkWfOK1IpN7pc-Xmpl4A78W_8IBd9sJW2v4_ILR2YtNWC8ZbMz1dhjazBo6lTvldO7TQM9CIR-vqpcUhM8RCmu1_px0S_fmUW2lGI', status: 'online' },
  ];

  const getStatusColor = (status: any) => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex bg-white">
          <div className="flex-1 p-6">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Home</h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <span className="material-symbols-outlined">search</span>
                </button>
                <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
              </div>
            </header>
            <div className="space-y-6">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Channels</h3>
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between">
                      <p className="text-gray-700">{channel.name}</p>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600">Join</button>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  <span>Create Channel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-80 border-l border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${member.profilePic})` }}></div>
                    <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></span>
                  </div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;