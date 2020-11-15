<template>
<div class="hold-transition">
  <div class="content-header">
          {{errorMsg}}
</div>
</div>
</template>

<script>
export default {
  data() {
    return {
        errorMsg:"权限不足！请联系管理员！"
    };
  }
  
};
</script>